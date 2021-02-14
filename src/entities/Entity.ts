import {PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, } from "typeorm";
import { classToPlain, Exclude } from "class-transformer";


export default abstract class Entity extends BaseEntity {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    toJSON() {
        // classToPlain does the transformation of the model
        return classToPlain(this)
    }
}
