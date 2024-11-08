async function loadImages() {
    try {
        // Replace the URL with your server's address and port if needed
        const response = await fetch('http://localhost:5000/api/imageslider'); 
        const images = await response.json();
        console.log(images);
        const sliderPart = document.getElementById('slider-part');
        sliderPart.innerHTML = ''; // Clear existing content

        images.forEach((image) => {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'single-slider bg_cover pt-150';
            imageDiv.style.backgroundImage = `url(${image.image_path})`; // Assuming image_path holds the full path or relative URL
            imageDiv.setAttribute('data-overlay', '4');

            imageDiv.innerHTML = `
                <div class="container">
                    <div class="row">
                        <div class="col-xl-7 col-lg-9">
                            <div class="slider-cont">
                                <p data-animation="fadeInUp" data-delay="1.3s">${image.content}</p>
                                <ul>
                                    <li><a data-animation="fadeInUp" data-delay="1.6s" class="main-btn" href="#">Read More</a></li>
                                    <li><a data-animation="fadeInUp" data-delay="1.9s" class="main-btn main-btn-2" href="#">Get Started</a></li>
                                </ul>
                            </div>
                        </div>
                    </div> <!-- row -->
                </div> <!-- container -->
            `;

            sliderPart.appendChild(imageDiv);
        });
    } catch (error) {
        console.error('Error loading images:', error);
    }
}

// Run the script when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadImages);
