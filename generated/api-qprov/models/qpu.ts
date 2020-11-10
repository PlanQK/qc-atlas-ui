/* tslint:disable */
import { Gate } from './gate';
import { QpuProperties } from './qpu-properties';
export type Qpu = { 'id'?: number, 'provider'?: string, 'backendName'?: string, 'backendVersion'?: string, 'properties'?: QpuProperties, 'allowQObject'?: boolean, 'nQubits'?: number, 'basisGates'?: Array<string>, 'gates'?: Array<Gate>, 'local'?: boolean, 'simulator'?: boolean, 'conditional'?: boolean, 'openPulse'?: boolean, 'memory'?: boolean, 'maxShots'?: number, 'nUchannels'?: number, 'measLevels'?: Array<number>, 'dt'?: number, 'dtm'?: number, 'repTimes'?: Array<number>, 'measKernels'?: Array<string>, 'discriminators'?: Array<string>, 'creditsRequired'?: boolean, 'description'?: string, 'maxExperiments'?: number, 'nRegisters'?: number, 'onlineDate'?: string, 'sampleName'?: string, 'url'?: string, 'allowQCircuit'?: boolean, 'allowObjectStorage'?: boolean, 'nregisters'?: number, 'nqubits'?: number, 'nuchannels'?: number };
