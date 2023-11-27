import React from "react";
import s from "./index.module.scss";
import Star from "./svg/Star";
import Cyrcle from "./svg/Cyrcle";
import Heart from "./svg/Heart";

type Rating = {
	icon: React.ReactNode;
	id: number;
};

const rating: Rating[] = [
	{
		icon: <Star />,
		id: 1
	},
	{
		icon: <Star />,
		id: 2
	},
	{
		icon: <Star />,
		id: 3
	},
	{
		icon: <Star />,
		id: 4
	},
	{
		icon: <Star />,
		id: 5
	}
];

type Cyrcle = {
	title: string;
	icon: React.ReactNode;
	id: number;
};

const hollowCyrcle: Cyrcle[] = [
	{
		title: "s",
		icon: <Cyrcle />,
		id: 1
	},
	{
		title: "m",
		icon: <Cyrcle />,
		id: 2
	},
	{
		title: "l",
		icon: <Cyrcle />,
		id: 3
	},
	{
		title: "xl",
		icon: <Cyrcle />,
		id: 4
	}
];

const ProductCart: React.FC = () => {
	return (
		<div className={s.product}>
			<div className={s.item}>
				<div className={s.carouselBlock}>
					<div className={s.smallImgBlock}>
						<div className={s.bgImgSmallActive}>
							<img className={s.smallImg} src="img/goods/01.png" />
						</div>
						<div className={s.bgImgSmall}>
							<img className={s.smallImg} src="img/goods/01.png" />
						</div>
						<div className={s.bgImgSmall}>
							<img className={s.smallImg} src="img/goods/01.png" />
						</div>
						<div className={s.bgImgSmall}>
							<img className={s.smallImg} src="img/goods/01.png" />
						</div>
					</div>
					<div className={s.bgImgBig}>
						<img className={s.search} src="img/product/search.svg" alt="search" />
						<img className={s.cyrcle} src="img/product/cyrcle.svg" alt="cyrcle" />
						<img className={s.bigImg} src="img/goods/01.png" />
					</div>
				</div>
				<div className={s.info}>
					<h3 className={s.title}>Barberton Daisy</h3>
					<div className={s.rating}>
						<p className={s.price}>$119.00</p>
						<div className={s.stars}>
							{rating.map((star) => (
								<div className={s.starSvgActive} key={star.id}>
									{star.icon}
								</div>
							))}
							<p className={s.review}>19 Customer Review</p>
						</div>
					</div>
					<p className={s.descriptionTitle}>Short Description:</p>
					<p className={s.descriptionInfo}>
						The ceramic cylinder planters come with a wooden stand to help elevate your plants off
						the ground. The ceramic cylinder planters come with a wooden stand to help elevate your
						plants off the ground.{" "}
					</p>

					<p className={s.sizeTitle}>Size:</p>
					<div className={s.sizeBlock}>
						{hollowCyrcle.map((item) => (
							<div className={s.sizeActive} key={item.id}>
								<p>{item.title}</p>
								{item.icon}
							</div>
						))}
					</div>
					<div className={s.buying}>
						<button className={s.minus}>-</button>
						<span className={s.quantity}>1</span>
						<button className={s.plus}>+</button>

						<button className={s.buyNow}>Buy NOW</button>
						<button className={s.addToCart}>Add to cart</button>
						<button className={s.favoriteActive}>
							<Heart />
						</button>
					</div>
					<p className={s.productInfoSku}>
						SKU: <span> 1995751877966</span>
					</p>
					<p className={s.productInfoCategory}>
						Categories:<span> Potter Plants</span>
					</p>
					<div className={s.links}>
						<p className={s.share}>Share this products:</p>
						<a href="www.twitter.com">
							<img src="img/product/facebook.svg" alt="facebook" />
						</a>
						<a href="www.twitter.com">
							<img src="img/product/twitter.svg" alt="twitter" />
						</a>
						<a href="www.twitter.com">
							<img src="img/product/linkedin.svg" alt="linkedin" />
						</a>
					</div>
				</div>
			</div>
			<div className={s.descriptionReviews}>
				<div className={s.switchCategory}>
					<h5 className={s.titleActive}>Product Description</h5>
					<h5 className={s.titleActive}>
						Reviews <span>(19)</span>
					</h5>
				</div>
				<div className={s.description}>
					<p className={s.descriptionInfo}>
						The ceramic cylinder planters come with a wooden stand to help elevate your plants off
						the ground. The ceramic cylinder planters come with a wooden stand to help elevate your
						plants off the ground. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
						fringilla augue nec est tristique auctor. Donec non est at libero vulputate rutrum.
						Morbi ornare lectus quis justo gravida semper. Nulla tellus mi, vulputate adipiscing
						cursus eu, suscipit id nulla. Pellentesque aliquet, sem eget laoreet ultrices, ipsum
						metus feugiat sem, quis fermentum turpis eros eget velit. Donec ac tempus ante. Fusce
						ultricies massa massa. Fusce aliquam, purus eget sagittis vulputate, sapien libero
						hendrerit est, sed commodo augue nisi non neque. Lorem ipsum dolor sit amet, consectetur
						adipiscing elit. Sed tempor, lorem et placerat vestibulum, metus nisi posuere nisl, in
						accumsan elit odio quis mi. Cras neque metus, consequat et blandit et, luctus a nunc.
						Etiam gravida vehicula tellus, in imperdiet ligula euismod eget. The ceramic cylinder
						planters come with a wooden stand to help elevate your plants off the ground.{" "}
					</p>
					<h5 className={s.descriptionTitle}>Living Room:</h5>
					<p className={s.descriptionInfo}>
						The ceramic cylinder planters come with a wooden stand to help elevate your plants off
						the ground. The ceramic cylinder planters come with a wooden stand to help elevate your
						plants off the ground. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					</p>
					<h5 className={s.descriptionTitle}>Dining Room:</h5>
					<p className={s.descriptionInfo}>
						The benefits of houseplants are endless. In addition to cleaning the air of harmful
						toxins, they can help to improve your mood, reduce stress and provide you with better
						sleep. Fill every room of your home with houseplants and their restorative qualities
						will improve your life.
					</p>
					<h5 className={s.descriptionTitle}>Office:</h5>
					<p className={s.descriptionInfo}>
						The ceramic cylinder planters come with a wooden stand to help elevate your plants off
						the ground. The ceramic cylinder planters come with a wooden stand to help elevate your
						plants off the ground. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					</p>
				</div>
			</div>
		</div>
	);
};

export default ProductCart;
