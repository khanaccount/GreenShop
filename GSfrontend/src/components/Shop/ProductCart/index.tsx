import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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

interface Review {
	id: number;
	customer: string;
	rating: number;
	text: string;
}

interface Product {
	name: string;
	salePrice: string;
	mainImg: string;
	rating: number;
	id: number;
	shortDescriptionInfo: string;
	size: {
		id: number;
		name: string;
	};
	categories: {
		id: number;
		name: string;
	};
	sku: string;
	reviews: Review[];
}

const calculateAverageRating = (reviews: Review[]) => {
	if (reviews.length === 0) {
		return 0;
	}

	const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
	return totalRating / reviews.length;
};

const ProductCart: React.FC = () => {
	const [activeTab, setActiveTab] = useState("description");
	const [product, setProduct] = useState<Product | null>(null);
	const [selectedImage, setSelectedImage] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const [modalImage, setModalImage] = useState<string>("");
	const [quantity, setQuantity] = useState<number>(1);
	const [reviewText, setReviewText] = useState("");
	const [starsSelected, setStarsSelected] = useState(0);

	const averageRating = product?.reviews ? calculateAverageRating(product.reviews) : 0;

	const handleStarClick = (id: number) => {
		setStarsSelected(id);
	};

	const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const response = await axios.post(`http://127.0.0.1:8000/shop/product/${id}/review/`, {
				rating: starsSelected,
				text: reviewText
			});

			console.log("Ответ от сервера:", response.data);
			// Дополнительная логика после успешной отправки отзыва

			// Очищаем поля после успешной отправки отзыва
			setReviewText("");
			setStarsSelected(0);
		} catch (error) {
			console.error("Ошибка при отправке отзыва:", error);
			// Обработка ошибок при отправке запроса
		}
	};

	const decreaseQuantity = () => {
		if (quantity > 1) {
			setQuantity(quantity - 1);
		}
	};

	const increaseQuantity = () => {
		if (quantity < 99) {
			setQuantity(quantity + 1);
		}
	};

	const handleModalOpen = () => {
		setModalImage(selectedImage);
		setModalOpen(true);
	};

	const handleImageClick = (imageSrc: string) => {
		setSelectedImage(imageSrc);
	};

	const handleTabClick = (tab: string) => {
		setActiveTab(tab);
	};

	const { id } = useParams();

	useEffect(() => {
		if (id) {
			axios
				.get(`http://127.0.0.1:8000/shop/product/${id}/`)
				.then((response) => {
					setProduct(response.data[0]);
					setSelectedImage(`/${response.data[0].mainImg}`);
				})
				.catch((error) => {
					console.error("Ошибка при получении данных о товаре: ", error);
				});
		}
	}, []);

	if (!product) {
		return <div className={s.Loading}>Loading...</div>;
	}
	return (
		<div className={s.product}>
			<div className={s.item}>
				<div className={s.carouselBlock}>
					<div className={s.smallImgBlock}>
						<div
							className={
								selectedImage === `/${product.mainImg}` ? s.bgImgSmallActive : s.bgImgSmall
							}
							onClick={() => handleImageClick(`/${product.mainImg}`)}>
							<img className={s.smallImg} src={`/${product.mainImg}`} />
						</div>

						<div
							className={
								selectedImage === "/img/product/01.png" ? s.bgImgSmallActive : s.bgImgSmall
							}
							onClick={() => handleImageClick("/img/product/01.png")}>
							<img className={s.smallImg} src="/img/product/01.png" />
						</div>
						<div
							className={
								selectedImage === "/img/product/02.png" ? s.bgImgSmallActive : s.bgImgSmall
							}
							onClick={() => handleImageClick("/img/product/02.png")}>
							<img className={s.smallImg} src="/img/product/02.png" />
						</div>
						<div
							className={
								selectedImage === "/img/product/03.png" ? s.bgImgSmallActive : s.bgImgSmall
							}
							onClick={() => handleImageClick("/img/product/03.png")}>
							<img className={s.smallImg} src="/img/product/03.png" />
						</div>
					</div>
					<div className={s.bgImgBig}>
						<img className={s.search} src="/img/product/search.svg" alt="search" />
						<img className={s.cyrcle} src="/img/product/cyrcle.svg" alt="cyrcle" />
						<img
							onClick={() => {
								handleModalOpen();
							}}
							className={s.bigImg}
							src={selectedImage}
						/>
						{modalOpen && (
							<div className={s.modal}>
								<div className={s.modalContent}>
									<span className={s.close} onClick={() => setModalOpen(false)}>
										&times;
									</span>
									<img className={s.modalImage} src={modalImage} alt="Modal" />
								</div>
							</div>
						)}
					</div>
				</div>
				<div className={s.info}>
					<h3 className={s.title}>{product.name}</h3>
					<div className={s.rating}>
						<p className={s.price}>{product.salePrice}</p>
						<div className={s.stars}>
							{rating.map((star) => (
								<div
									className={star.id <= Math.round(averageRating) ? s.starSvgActive : s.starSvg}
									key={star.id}>
									{star.icon}
								</div>
							))}
							<p className={s.review}>{product.reviews.length} Customer Review</p>
						</div>
					</div>
					<p className={s.descriptionTitle}>Short Description:</p>
					<p className={s.descriptionInfo}>
						{product.shortDescriptionInfo ? (
							product.shortDescriptionInfo
						) : (
							<p>Описание товара отсутствует.</p>
						)}
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
						<button className={s.minus} onClick={decreaseQuantity}>
							-
						</button>
						<span className={s.quantity}>{quantity}</span>
						<button className={s.plus} onClick={increaseQuantity}>
							+
						</button>

						<button className={s.buyNow}>Buy NOW</button>
						<button className={s.addToCart}>Add to cart</button>
						<button className={s.favoriteActive}>
							<Heart />
						</button>
					</div>
					<p className={s.productInfoSku}>
						SKU: <span> {product.sku}</span>
					</p>
					<p className={s.productInfoCategory}>
						Categories:<span> {product.categories.name}</span>
					</p>
					<div className={s.links}>
						<p className={s.share}>Share this products:</p>
						<a href="www.twitter.com">
							<img src="/img/product/facebook.svg" alt="facebook" />
						</a>
						<a href="www.twitter.com">
							<img src="/img/product/twitter.svg" alt="twitter" />
						</a>
						<a href="www.twitter.com">
							<img src="/img/product/linkedin.svg" alt="linkedin" />
						</a>
					</div>
				</div>
			</div>
			<div className={s.descriptionReviews}>
				<div className={s.switchCategory}>
					<h5
						onClick={() => handleTabClick("description")}
						className={`${s.title} ${activeTab === "description" ? s.titleActive : ""}`}>
						Product Description
					</h5>
					<h5
						className={`${s.title} ${activeTab === "reviews" ? s.titleActive : ""}`}
						onClick={() => handleTabClick("reviews")}>
						Reviews <span>({product.reviews.length})</span>
					</h5>
				</div>
				{activeTab === "description" ? (
					<div className={s.description}>
						<p className={s.descriptionInfo}>
							{product.shortDescriptionInfo ? (
								product.shortDescriptionInfo
							) : (
								<p>Описание товара отсутствует.</p>
							)}
						</p>
					</div>
				) : (
					<div className={s.reviews}>
						{product.reviews && product.reviews.length > 0 ? (
							product.reviews.map((review) => (
								<div key={review.id} className={s.review}>
									<h5 className={s.reviewUserName}>
										{review.customer ? review.customer : "customer"}
									</h5>
									<div className={s.stars}>
										{rating.map((star) => (
											<div
												className={star.id <= review.rating ? s.starSvgActive : s.starSvg}
												key={star.id}>
												{star.icon}
											</div>
										))}
									</div>
									<p className={s.reviewInfo}> {review.text}</p>
								</div>
							))
						) : (
							<p>No reviews available</p>
						)}
						<div className={s.reviewForm}>
							<h3>Добавить отзыв</h3>
							<form onSubmit={handleSubmitReview}>
								<div className={s.stars}>
									{[1, 2, 3, 4, 5].map((id) => (
										<div
											key={id}
											className={`${s.star} ${id <= starsSelected ? s.starSelected : ""}`}
											onClick={() => handleStarClick(id)}>
											<Star />
										</div>
									))}
								</div>
								<textarea
									className={s.reviewText}
									placeholder="Напишите свой отзыв здесь..."
									value={reviewText}
									onChange={(e) => setReviewText(e.target.value)}></textarea>
								<button className={s.submitButton} type="submit">
									Отправить
								</button>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductCart;
