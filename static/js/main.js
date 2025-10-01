// Frontend JavaScript for UI and API calls

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('grid-form');
    const previewImg = document.getElementById('preview-img');
    const generateBtn = document.getElementById('generate-btn');

    // Function to collect form data
    function getFormData() {
        const data = new FormData(form);
        return {
            paper_size: data.get('paper_size'),
            orientation: data.get('orientation'),
            dictionary: data.get('dictionary'),
            rows: parseInt(data.get('rows')),
            cols: parseInt(data.get('cols')),
            marker_size_mm: parseFloat(data.get('marker_size_mm')),
            separation_mm: parseFloat(data.get('separation_mm')),
            show_ids: data.has('show_ids'),
            show_scale: data.has('show_scale'),
            show_params: data.has('show_params'),
            base_translation: [
                parseFloat(data.get('base_translation_x')),
                parseFloat(data.get('base_translation_y')),
                parseFloat(data.get('base_translation_z'))
            ],
            base_rotation: [
                parseFloat(data.get('base_rotation_roll')),
                parseFloat(data.get('base_rotation_pitch')),
                parseFloat(data.get('base_rotation_yaw'))
            ]
        };
    }

    // Function to update preview
    async function updatePreview() {
        const data = getFormData();
        try {
            const response = await fetch('/api/preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                previewImg.src = url;
            } else {
                console.error('Preview failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Function to generate PDF
    async function generatePDF() {
        const data = getFormData();
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'aruco_grid.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                console.error('Generate failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Event listeners
    form.addEventListener('input', updatePreview);
    form.addEventListener('change', updatePreview);
    generateBtn.addEventListener('click', generatePDF);

    // Initial preview
    updatePreview();
});