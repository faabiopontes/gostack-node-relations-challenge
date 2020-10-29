import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity()
class OrdersProducts {
  @CreateDateColumn()
  id: string;

  @ManyToOne(_ => Order, order => order.id)
  order: Order;

  @ManyToOne(_ => Product, product => product.id)
  @JoinColumn()
  product: Product;

  @Column()
  product_id: string;

  @Column()
  order_id: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @UpdateDateColumn()
  created_at: Date;

  @PrimaryGeneratedColumn()
  updated_at: Date;
}

export default OrdersProducts;
