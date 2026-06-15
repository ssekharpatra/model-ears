export interface Product {
  id: string;
  name: string;
  image: string;
  alt: string;
}

export interface CarouselState {
  activeIndex: number;
  products: Product[];
}

export interface VisibleProducts {
  left: Product;
  center: Product;
  right: Product;
}
