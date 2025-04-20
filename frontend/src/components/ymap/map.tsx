import {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapComponentsProvider
} from "ymap3-components";

export const YandexMap = () => {

    return (

        <YMapComponentsProvider apiKey={"dd8ba29b-b8bc-4ffb-99dc-666876d30d5f"}>
            <YMap location={location}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
            </YMap>
        </YMapComponentsProvider>

    );


}
