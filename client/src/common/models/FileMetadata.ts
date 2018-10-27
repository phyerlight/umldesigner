import {File} from "./File";

export type FileMetadata = Pick<File, '_key'|'type'|'name'|'createdBy_key'|'createdOn'|'modifiedBy_key'|'modifiedOn'>;