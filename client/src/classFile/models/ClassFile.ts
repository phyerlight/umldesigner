import {CLASS_FILE_TYPE} from "./index";
import {File} from '../../common/models';
import {ClassFileEntities} from "./ClassFileEntities";

export interface ClassFile extends File {
    type: CLASS_FILE_TYPE,
    entities: {
        [id: number]: ClassFileEntities
    }
}