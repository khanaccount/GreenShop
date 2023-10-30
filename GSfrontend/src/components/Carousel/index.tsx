import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const MyCarousel: React.FC = () => {
	return (
		<Carousel>
			<div>
				<img src="path_to_image_1.jpg" alt="Image 1" />
				<p className="legend">Image 1</p>
			</div>
			<div>
				<img src="path_to_image_2.jpg" alt="Image 2" />
				<p className="legend">Image 2</p>
			</div>
			<div>
				<img src="path_to_image_3.jpg" alt="Image 3" />
				<p className="legend">Image 3</p>
			</div>
		</Carousel>
	);
};

export default MyCarousel;
