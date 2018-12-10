import {Project} from "./Project";
import {FileMetadata} from "../../common/models";

export interface ProjectWithMeta extends Project {
  files: FileMetadata[]
}