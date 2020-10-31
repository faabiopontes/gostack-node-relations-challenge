import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IProductOrder {
  product_id: string;
  price: number;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

interface IFindProducts {
  id: string;
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);
    if (!customer) {
      throw new AppError('Customer not found');
    }

    const productsIdArray = [] as IFindProducts[];
    products.forEach(product => productsIdArray.push({ id: product.id }));

    const foundProducts = await this.productsRepository.findAllById(
      productsIdArray,
    );

    if (foundProducts.length !== products.length) {
      throw new AppError('Product not found');
    }

    const productsOrder = [] as IProductOrder[];
    products.forEach(product => {
      const foundProduct = foundProducts.find(_ => _.id === product.id);
      if (foundProduct) {
        if (product.quantity > foundProduct.quantity) {
          throw new AppError(
            `Product ${foundProduct.name} quantity is not enough`,
          );
        }

        productsOrder.push({
          product_id: product.id,
          quantity: product.quantity,
          price: foundProduct.price,
        });
      }
    });

    const order = this.ordersRepository.create({
      customer,
      products: productsOrder,
    });
    this.productsRepository.updateQuantity(products);
    return order;
  }
}

export default CreateOrderService;
