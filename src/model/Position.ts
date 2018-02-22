import {Valuation} from "./Valuation";

export interface Position {
    black: Array<Valuation>;
    white: Array<Valuation>;
}