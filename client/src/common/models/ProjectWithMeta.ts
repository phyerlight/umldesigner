import {Project} from "../../app/models/Project";
import {FileMetadata} from "./FileMetadata";

export interface ProjectWithMeta extends Project {
  files: FileMetadata[]
}