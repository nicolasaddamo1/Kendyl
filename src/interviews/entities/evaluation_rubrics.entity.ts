import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class EvaluationRubric {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('jsonb')
    criteria_json: object;
}
