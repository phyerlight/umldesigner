import {File, FileEntity} from "../../common/models";
import {UI_FILE_TYPE} from "./index";

export interface UIFile extends File {
    type: UI_FILE_TYPE
    entities: {
        [id: number]: FileEntity
    }
}