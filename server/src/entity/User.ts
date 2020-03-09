import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Purchased } from './Purchased';
import { Wish } from './Wish';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number; // 유저 id

  @Column()
  name: string; // 유저 이름

  @Column()
  password: string; // 유저 비밀번호

  @Column({ nullable: true, default: 0 })
  cash: number; // 유저 충전금

  @Column()
  email: number; // 유저 로그인 이메일

  @OneToMany(
    type => Purchased,
    purchased => purchased.user,
  )
  purchasedList: Purchased[];

  @OneToMany(
    type => Wish,
    wish => wish.user,
  )
  wishList: Wish[];
}
