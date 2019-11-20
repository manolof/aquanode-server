import { lightsSchedule } from '../../conf/schedule';
import { BaseSchedule } from '../schedule';
import { Lights } from './lights';

const lights = new Lights();
export const LightsSchedule = new BaseSchedule(lights, lightsSchedule);
