import BarChartComp from './BarChartComp'
import MultiBarChartComp from './MultiBarChartComp'
import ClickTableComp from './ClickTableComp'
import GaugeChartComp from './GaugeChartComp'
import LineChartComp from './LineChartComp'
import PieChartComp from './PieChartComp'
import RowTableComp from './RowTableComp'
import StatusTableComp from './StatusTableComp'
import TableComp from './TableComp'
import ExternalUrlComp from './ExternalUrlComp'
import DateLineChartComp from './DateLineChartComp'

import AiRealTimeStatus from './custom/AiRealTimeStatus'
import PumpDetStatus from './custom/PumpDetStatus'
import RealtimeVideo from './custom/RealtimeVideo'
import IntelligentRealtimeVideo from './custom/IntelligentRealtimeVideo'
import SmartPortSummary from './custom/SmartPortSummary'
import SmartPortEventSummary from './custom/SmartPortEventSummary'
import SmartPortVideo from './custom/SmartPortVideo'
import ProductionLineColEvent from './custom/ProductionLineColEvent'

export default {
  GN00000129: TableComp,
  GN00000130: GaugeChartComp,
  GN00000131: PieChartComp,
  GN00000133: LineChartComp,
  GN00000140: BarChartComp,
  GN00000245: ClickTableComp,
  GN00000215: MultiBarChartComp,
  GN00000216: RowTableComp,
  GN00000217: StatusTableComp,
  GN00000218: AiRealTimeStatus,
  GN00000219: PumpDetStatus,
  GN00000220: RealtimeVideo,
  GN00000221: IntelligentRealtimeVideo,
  GN00000376: ExternalUrlComp,
  GN00000377: SmartPortSummary,
  GN00000378: SmartPortEventSummary,
  GN00000379: SmartPortVideo,
  GN00000380: DateLineChartComp,
  GN00000381: ProductionLineColEvent
}
