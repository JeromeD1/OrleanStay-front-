import { YearBusinessStat } from "./YearBusinessStat.model"

  export interface AppartmentBusinessStat {
    appartmentId: number
    appartmentName: string
    appartmentDescription: string
    yearStatistics: YearBusinessStat[]
  }