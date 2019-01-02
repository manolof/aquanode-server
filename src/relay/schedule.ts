import { relaySchedule } from '../../conf/schedule';
import { BaseSchedule } from '../schedule';
import { Relay } from './relay';

export const RelaySchedule = new BaseSchedule(Relay, relaySchedule);
