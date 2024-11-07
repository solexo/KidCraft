// Get canvas and context for drawing
let canvas = document.getElementById('drawingCanvas');
let ctx = canvas.getContext('2d');
let drawing = false;
let color = 'black';
let brushSize = 5;

// Scale canvas for high-DPI screens
function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * pixelRatio;
    canvas.height = canvas.offsetHeight * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);
}
resizeCanvas(); // Initial resize

// Re-scale canvas when the window is resized
window.addEventListener('resize', resizeCanvas);

// Event listeners for mouse and touch drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Add touch events for mobile
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

// Functions for drawing
function startDrawing(e) {
    e.preventDefault();
    drawing = true;
    draw(e);
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;
    
    e.preventDefault();
    
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    let x, y;
    const rect = canvas.getBoundingClientRect();

    if (e.type.includes('touch')) {
        const touch = e.touches[0];
        x = (touch.clientX - rect.left);
        y = (touch.clientY - rect.top);
    } else {
        x = (e.clientX - rect.left);
        y = (e.clientY - rect.top);
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Change color of the drawing
function setColor(newColor) {
    color = newColor;
}

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Increase brush size
function increaseBrush() {
    brushSize += 1;
}

// Decrease brush size
function decreaseBrush() {
    brushSize = Math.max(1, brushSize - 1);
}

// Save drawing as image
function saveDrawing() {
    let link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'drawing.png';
    link.click();
}

// Share the drawing
function shareDrawing() {
    if (navigator.share) {
        navigator.share({
            title: 'Kids Art Studio',
            text: 'Check out this awesome drawing app for kids!',
            url: window.location.href
        })
        .then(() => console.log('Shared successfully!'))
        .catch((error) => console.log('Error sharing: ', error));
    } else {
        alert('Sharing is not supported on your device.');
    }
}

// Language Change
function setLanguage(lang) {
    const translations = {
        en: {
            studioTitle: "🎨 Kids Art Studio! 🎨",
            clearDrawing: "Clear Drawing",
            biggerBrush: "Bigger Brush",
            smallerBrush: "Smaller Brush",
            saveDrawing: "Save Drawing",
            shareDrawing: "Share Drawing",
            uploadLabel: "Upload Image"
        },
        fr: {
            studioTitle: "🎨 Studio d'Art pour Enfants! 🎨",
            clearDrawing: "Effacer le dessin",
            biggerBrush: "Pinceau plus gros",
            smallerBrush: "Pinceau plus petit",
            saveDrawing: "Sauvegarder le dessin",
            shareDrawing: "Partager le dessin",
            uploadLabel: "Télécharger l'Image"
        },
        ar: {
            studioTitle: "🎨 استوديو فن للأطفال! 🎨",
            clearDrawing: "مسح الرسم",
            biggerBrush: "فرشاة أكبر",
            smallerBrush: "فرشاة أصغر",
            saveDrawing: "حفظ الرسم",
            shareDrawing: "مشاركة الرسم",
            uploadLabel: "تحميل الصورة"
        }
    };

    document.getElementById('studio-title').textContent = translations[lang].studioTitle;
    document.getElementById('clearDrawing').textContent = translations[lang].clearDrawing;
    document.getElementById('biggerBrush').textContent = translations[lang].biggerBrush;
    document.getElementById('smallerBrush').textContent = translations[lang].smallerBrush;
    document.getElementById('saveDrawing').textContent = translations[lang].saveDrawing;
    document.getElementById('shareDrawing').textContent = translations[lang].shareDrawing;
    document.getElementById('upload-label').textContent = translations[lang].uploadLabel;

    // Adjust the page's direction based on language (right-to-left for Arabic)
    if (lang === 'en') {
        document.body.dir = 'ltr';
    } else if (lang === 'ar') {
        document.body.dir = 'rtl';
    } else {
        document.body.dir = 'ltr';
    }
}

// Upload Image
function uploadImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing image
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw uploaded image on canvas
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}
