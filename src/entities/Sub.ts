import {Entity as TOEntity,  Column, Index, BeforeInsert, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { makeId, slugify } from '../util/helper'

import Entity from './Entity';
import Post from "./Post";
import User from "./User";

//name of the table
@TOEntity('subs')
export default class Sub extends Entity {
    constructor(sub: Partial<Sub>) {
        super()
        Object.assign(this, sub)
    }

    @Index()
    @Column({ unique: true })
    name: string

    @Column()
    title: string

    @Column({ type: 'text', nullable: true })
    description: string

    @Column({ nullable: true })
    // unique resource name
    imageUrn: string

    @Column({ type: 'text', nullable: true })
    bannerUrn: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username'})
    user: User

    @OneToMany(() => Post, post => post.sub)
    posts: Post[]

}
