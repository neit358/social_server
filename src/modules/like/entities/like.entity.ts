import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  post: Post;

  @Column()
  postId: string;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column()
  userId: string;
}
