import {Column,Entity,Index,JoinColumn,ManyToOne,OneToMany,PrimaryGeneratedColumn} from "typeorm";
import {OrderItems} from './OrderItems'
import {Users} from './Users'

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}


@Index("orders_pkey",["id",],{ unique:true })
@Entity("orders" ,{schema:"public" } )
export class Orders {
    @PrimaryGeneratedColumn({ type:"integer", name:"id" })
    id:number;

    @Column("numeric",{ name:"total",precision:10,scale:2 })
    total:string;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Column("timestamp without time zone",{ name:"created_at",default: () => "CURRENT_TIMESTAMP", })
    createdAt:Date;

    @Column("timestamp without time zone",{ name:"updated_at" })
    updatedAt:Date;

    @OneToMany(()=>OrderItems,orderItems=>orderItems.order)


    orderItems:OrderItems[];

    @ManyToOne(()=>Users,users=>users.orders,{ onDelete:"RESTRICT",onUpdate:"CASCADE" })
    @JoinColumn([{ name: "user_id", referencedColumnName: "id" },
    ])

    user:Users;

}
