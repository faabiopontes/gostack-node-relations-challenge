import { getRepository, Repository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = await this.ormRepository.create({ name, price, quantity });
    await this.ormRepository.save(product);
    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const foundProduct = await this.ormRepository.findOne({
      where: { name },
    });

    return foundProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const foundProducts = await this.ormRepository.findByIds(products);

    return foundProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const updatedProducts = [] as Product[];
    await products.forEach(async product => {
      const foundProduct = await this.ormRepository.findOne({
        where: { id: product.id },
      });
      if (!foundProduct) {
        return;
      }
      const updatedProduct = { ...foundProduct } as Product;
      updatedProduct.quantity -= product.quantity;
      await this.ormRepository.save(updatedProduct);
      updatedProducts.push(updatedProduct);
    });
    return updatedProducts;
  }
}

export default ProductsRepository;
