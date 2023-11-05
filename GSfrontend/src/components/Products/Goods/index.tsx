import React from "react";
import s from "./index.module.scss";
import Pagination from "../Pagination";

type Goods = {
  title: string;
  mainPrice: string;
  salePrice: string;
  mainImg: string;
  discountPercentage: string;
  discount: boolean;
  id: number;
};

const items: Goods[] = [
  {
    id: 1,
    title: "Barberton Daisy",
    mainPrice: "$119.00",
    salePrice: "$229.00",
    mainImg: "img/goods/01.png",
    discount: false,
    discountPercentage: "11"
  },
  {
    id: 2,
    title: "Angel Wing Begonia",
    mainPrice: "$169.00",
    salePrice: "$229.00",
    mainImg: "img/goods/02.png",
    discount: true,
    discountPercentage: "25"
  },
  {
    id: 3,
    title: "African Violet",
    mainPrice: "$199.00",
    salePrice: "$229.00",
    mainImg: "img/goods/03.png",
    discount: false,
    discountPercentage: "12"
  },
  {
    id: 4,
    title: "Beach Spider Lily",
    mainPrice: "$129.00",
    salePrice: "$229.00",
    mainImg: "img/goods/04.jpg",
    discount: true,
    discountPercentage: "15"
  },
  {
    id: 5,
    title: "Blushing Bromeliad",
    mainPrice: "$139.00",
    salePrice: "$229.00",
    mainImg: "img/goods/05.png",
    discount: false,
    discountPercentage: "5"
  },
  {
    id: 6,
    title: "Aluminum Plant",
    mainPrice: "$179.00",
    salePrice: "$229.00",
    mainImg: "img/goods/06.png",
    discount: true,
    discountPercentage: "7"
  },
  {
    id: 7,
    title: "Bird's Nest Fern",
    mainPrice: "$99.00",
    salePrice: "$229.00",
    mainImg: "img/goods/07.png",
    discount: false,
    discountPercentage: "15"
  },
  {
    id: 8,
    title: "Broadleaf Lady Palm",
    mainPrice: "$59.00",
    salePrice: "$229.00",
    mainImg: "img/goods/08.png",
    discount: true,
    discountPercentage: "11"
  },
  {
    id: 9,
    title: "Chinese Evergreen",
    mainPrice: "$39.00",
    salePrice: "$229.00",
    mainImg: "img/goods/09.png",
    discount: false,
    discountPercentage: "15"
  },
  {
    id: 10,
    title: "Beach Spider Lily",
    mainPrice: "$129.00",
    salePrice: "$229.00",
    mainImg: "img/goods/04.jpg",
    discount: true,
    discountPercentage: "15"
  },
  {
    id: 11,
    title: "Blushing Bromeliad",
    mainPrice: "$139.00",
    salePrice: "$229.00",
    mainImg: "img/goods/05.png",
    discount: false,
    discountPercentage: "5"
  },
  {
    id: 12,
    title: "Aluminum Plant",
    mainPrice: "$179.00",
    salePrice: "$229.00",
    mainImg: "img/goods/06.png",
    discount: true,
    discountPercentage: "7"
  },
  {
    id: 13,
    title: "Bird's Nest Fern",
    mainPrice: "$99.00",
    salePrice: "$229.00",
    mainImg: "img/goods/07.png",
    discount: false,
    discountPercentage: "15"
  },
  {
    id: 14,
    title: "Broadleaf Lady Palm",
    mainPrice: "$59.00",
    salePrice: "$229.00",
    mainImg: "img/goods/08.png",
    discount: true,
    discountPercentage: "11"
  },
  {
    id: 15,
    title: "Chinese Evergreen",
    mainPrice: "$39.00",
    salePrice: "$229.00",
    mainImg: "img/goods/09.png",
    discount: false,
    discountPercentage: "15"
  },
  {
    id: 16,
    title: "Beach Spider Lily",
    mainPrice: "$129.00",
    salePrice: "$229.00",
    mainImg: "img/goods/04.jpg",
    discount: true,
    discountPercentage: "15"
  },
  {
    id: 17,
    title: "Blushing Bromeliad",
    mainPrice: "$139.00",
    salePrice: "$229.00",
    mainImg: "img/goods/05.png",
    discount: false,
    discountPercentage: "5"
  },
  {
    id: 18,
    title: "Aluminum Plant",
    mainPrice: "$179.00",
    salePrice: "$229.00",
    mainImg: "img/goods/06.png",
    discount: true,
    discountPercentage: "7"
  },
  {
    id: 19,
    title: "Bird's Nest Fern",
    mainPrice: "$99.00",
    salePrice: "$229.00",
    mainImg: "img/goods/07.png",
    discount: false,
    discountPercentage: "15"
  },
  {
    id: 20,
    title: "Broadleaf Lady Palm",
    mainPrice: "$59.00",
    salePrice: "$229.00",
    mainImg: "img/goods/08.png",
    discount: true,
    discountPercentage: "11"
  },
  {
    id: 21,
    title: "Chinese Evergreen",
    mainPrice: "$39.00",
    salePrice: "$229.00",
    mainImg: "img/goods/09.png",
    discount: false,
    discountPercentage: "15"
  }
];

const Goods: React.FC = () => {
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = React.useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayedItems = items.slice(startIndex, endIndex);

  return (
    <div className={s.goods}>
      <div className={s.cards}>
        {displayedItems.map((item) => (
          <div key={item.id} className={s.card}>
            <div className={s.cardImg}>
              <img src={item.mainImg} alt={item.title} />{" "}
              {item.discount ? (
                <p className={s.discount}>{item.discountPercentage}% OFF</p>
              ) : null}
              <div className={s.hoverLinks}>
                <a href="">
                  <img src="img/goods/cart.svg" alt="cart" />
                </a>
                <a href="">
                  <img src="img/goods/favorite.svg" alt="favorite" />
                </a>
              </div>
            </div>
            <div className={s.goodsInfo}>
              <p className={s.goodsName}>{item.title}</p>
              <div className={s.goodsPrices}>
                <p className={s.main}>{item.mainPrice}</p>
                {item.discount ? (
                  <p className={s.sale}>{item.salePrice}</p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(items.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Goods;