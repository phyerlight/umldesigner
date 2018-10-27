import {CLASS_FILE_TYPE, ClassFileEntities} from "./index";
import {File} from '../../common/models';

export interface ClassFile extends File {
    type: CLASS_FILE_TYPE,
    entities: {
        [id: number]: ClassFileEntities
    }
}