/* tslint:disable */
import { Link } from './link';
export interface EntityModelImplementationDto {
  '_links'?: Array<Link>;
  assumptions?: string;
  contributors?: string;
  dependencies?: string;
  description?: string;
  fileLocation: string;
  id?: string;
  inputFormat?: string;
  name: string;
  outputFormat?: string;
  parameter?: string;
}
