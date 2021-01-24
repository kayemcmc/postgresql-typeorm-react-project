import { IsEmail, Length } from "class-validator";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, CreateDateColumn, UpdateDateColumn, BeforeInsert} from "typeorm";
import bcrypt from "bcrypt";
import { classToPlain, Exclude } from "class-transformer";

@Entity('users')
export class User extends BaseEntity {
    constructor(user: Partial<User>) {
        super()
        Object.assign(this, user)
    }
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @IsEmail()
    @Column({ unique: true })
    email: string
     
    @Index()
    @Length(3, 255, { message: "Username must be at least 3 characters long"})
    @Column({ unique: true })
    username: string

    @Exclude()
    @Column()
    @Length(6, 255)
    password: string

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updatedAt: Date
    // before a record is created in the database
    //before it saves it hashes the password
    @BeforeInsert()
    async hashPassword() {
       this.password = await bcrypt.hash(this.password, 6) 
    }

    toJSON() {
        // classToPlain does the transformation of the model
        return classToPlain(this)
    }

}
