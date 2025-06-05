import { ResponsiveFunnel } from '@nivo/funnel';

interface FunnelComponnentProps {
  data: any
}

export function FunnelComponnent({data: data}: FunnelComponnentProps) {
    return(
        <ResponsiveFunnel /* or Funnel for fixed dimensions */
        data={data}
        valueFormat=">-.4s"
        colors={{scheme: 'blues'}}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        borderWidth={30}
        borderColor="#6baed6"
        borderOpacity={0.4}
        labelColor={'#47494d'} 
        animate={true}
        beforeSeparatorLength={100}
        beforeSeparatorOffset={20}
        afterSeparatorLength={100}
        afterSeparatorOffset={20}
        currentPartSizeExtension={10}
        currentBorderWidth={40}
        
    />
    )
}