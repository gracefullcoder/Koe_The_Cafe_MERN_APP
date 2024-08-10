import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import KoeMenu from "../../assets/KoeCafeFood.pdf";
import { actionPerformed, linkVisited } from '../../helperfunction';
import { IKImage } from 'imagekitio-react';


const MenuSection = ({ menus }) => {
    // console.log("menu section is called");
    let [transformTracks, setTransformTracks] = useState([]);

    const swipeRight = () => {
        setTransformTracks((prevTransformTracks) => {
            const totalLength = prevTransformTracks.length;
            const newTransformTracks = prevTransformTracks.map((prevTranslate) =>
                (prevTranslate + 29) % (29 * totalLength)
            );
            const menuCards = document.querySelectorAll(".service-card");
            newTransformTracks.forEach((translate, index) => {
                menuCards[index].style.transform = `translateX(${translate}rem)`;
            });
            return newTransformTracks;
        });
    };


    const swipeLeft = () => {
        setTransformTracks((prevTransformTracks) => {
            const totalLength = prevTransformTracks.length;
            const newTransformTracks = prevTransformTracks.map((prevTranslate) => {
                if (prevTranslate == 0) {
                    return (29 * (totalLength - 1))
                }
                return (prevTranslate - 29) % (29 * totalLength);
            }
            );

            const menuCards = document.querySelectorAll(".service-card");
            newTransformTracks.forEach((translate, index) => {
                menuCards[index].style.transform = `translateX(${translate}rem)`;
            });

            return newTransformTracks;
        });
    };


    useEffect(() => {
        const menuCards = document.querySelectorAll(".service-card");
        const totalSlide = menuCards.length;
        let initialTransform = [];
        for (let i = 0; i < totalSlide; i++) {
            let translateValue = (29 * i) % (29 * totalSlide);
            initialTransform.push(translateValue);
            menuCards[i].style.transform = `translateX(${translateValue}rem)`;
        }
        setTransformTracks(initialTransform);

        const swiperLogic = setInterval(() => { swipeRight() }, 5000);

        return () => clearInterval(swiperLogic);
    }, [menus]);



    return (
        <section className="section service bg-black-10 text-center" id="menu-section" aria-label="service">

            <div className="container">
                <p className="section-subtitle label-2">Indulge in Divine Delights</p>
                <h2 className="headline-1 section-title">Savor Our Irresistible Creations</h2>
                <p className="section-text">
                    Elevate your culinary experience with our exquisite selection of <b>coffee, cheeses, breads</b>, and
                    delightful in-house baked products. At Koe-The Kafe, we take pride in offering a menu fit for royalty.
                </p>

                <div className='menu-slider'>


                    {menus &&
                        menus.map((menu, index) => (
                            <div className="service-card" key={menu._id}>
                                <Link to={"/menu"} state={{ dishes: menu.dishes, title: menu.title }} className="has-before hover:shine">
                                    <figure className="card-banner img-holder">
                                        <IKImage
                                            urlEndpoint='https://ik.imagekit.io/vaibhav11'
                                            src={menu.image}
                                            className="img-cover"
                                            alt="Menu-image"
                                            transformation={[{
                                                quality: 100,
                                                height: 400,
                                                width: 300
                                            }]}
                                            loading='lazy'
                                        />

                                    </figure>
                                </Link>
                                <Link to={"/menu"} state={{ dishes: menu.dishes, title: menu.title }} >
                                    <div className="card-content">
                                        <h3 className="title-4 card-title">
                                            <p>{menu.title}</p>
                                        </h3>
                                        <p className="btn-text btn-view-menu hover-underline label-2">View Menu</p>
                                    </div>
                                </Link>
                            </div>
                        ))
                    }

                </div>
                <a href={KoeMenu} target='_blank' onClick={linkVisited}>
                    <p className='title-1 double-line menu-link'>
                        Complete Menu
                    </p>
                </a>
                <button
                    className="slider-btn prev"
                    aria-label="slide to previous"
                    data-prev-btn
                    onClick={swipeLeft}
                >
                    <ion-icon name="chevron-back"></ion-icon>
                </button>

                <button
                    className="slider-btn next"
                    aria-label="slide to next"
                    data-next-btn
                    onClick={swipeRight}
                >
                    <ion-icon name="chevron-forward"></ion-icon>
                </button>

            </div>

        </section>
    );
};

export default MenuSection;
