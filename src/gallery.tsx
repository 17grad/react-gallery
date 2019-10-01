import React, { useState, useEffect } from 'react';
import Swiper from 'react-id-swiper';

import * as styles from './gallery.scss';
import { Image } from './image';

interface GalleryProps {
  images: Image[];
}

export const Gallery = (props: GalleryProps) => {
  const [gallerySwiper, getGallerySwiper]: [any, any] = useState(null);
  const [thumbnailSwiper, getThumbnailSwiper]: [any, any] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen]: [boolean, any] = useState(false);

  const gallerySwiperParams = {
    getSwiper: getGallerySwiper,
    navigation: {
      nextEl: '.lightbox__button-next',
      prevEl: '.lightbox__button-prev',
    },
    preloadImages: true,
    lazy: true
  };
  const thumbnailSwiperParams = {
    getSwiper: getThumbnailSwiper,
    spaceBetween: 10,
    slidesPerView: 'auto',
    centeredSlides: true,
    touchRatio: 0.2,
    slideToClickedSlide: true
  };

  useEffect(() => {
    if (gallerySwiper !== null && gallerySwiper.controller &&
        thumbnailSwiper !== null && thumbnailSwiper.controller) {
      gallerySwiper.controller.control = thumbnailSwiper;
      thumbnailSwiper.controller.control = gallerySwiper;
    }
  }, [gallerySwiper, thumbnailSwiper]);

  const handleImageClick = (imageIndex: number) => {
    window.document.body.style.overflow = 'hidden';
    setIsLightboxOpen(true);
    gallerySwiper.slideTo(imageIndex);
  };

  const handleCloseClick = () => {
    window.document.body.style.overflow = 'visible';
    setIsLightboxOpen(false);
  };

  return (<>
    <ul className={ styles.gallery }>
      { props.images.map((thumb: Image, index: number) =>
        <li className={ styles.galleryItem }
            key={ thumb.id }
            onClick={ () => handleImageClick(index) }>
          <img className={ styles.galleryImage }
              src={ thumb.thumbnail }
              alt={ thumb.alt }/>
        </li>
      )}
    </ul>

    <div className={ styles.lightbox + ' ' + (isLightboxOpen ? styles.open : '') }>
      <button className={ styles.lightboxClose } onClick={ handleCloseClick } />

      {/* large swiper */}
      <div className={ styles.lightboxTop }>
        <Swiper {...gallerySwiperParams}>
          { props.images.map((image: Image) =>
            <div className={ 'swiper-slide ' + styles.lightboxSlide }
              key={ image.id }>
              <div className='swiper-lazy-preloader' />
              <img className={ styles.lightboxImage + ' swiper-lazy' }
                  onLoad={(e: any) => { e.target.className += ' ' + styles.loaded; }}
                  data-src={ image.src }
                  alt={ image.alt }  />
            </div>
          )}
        </Swiper>
      </div>

      {/* thumbnail swiper */}
      <div className={ styles.lightboxThumbs }>
        <Swiper {...thumbnailSwiperParams} slidesPerView='auto'>
          { props.images.map((thumb: Image) =>
            <div className={ styles.lightboxSlide } key={ thumb.id }>
              <img className={ styles.lightboxImage }
                  src={ thumb.thumbnail }
                  alt={ thumb.alt }  />
            </div>
          )}
        </Swiper>
      </div>
    </div>
  </>);
};
