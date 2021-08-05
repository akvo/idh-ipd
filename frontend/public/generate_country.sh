jq '[.objects?.Country_Polygon?.geometries?
    | .[]?.properties
    | {"id": .OBJECTID, "code": .M49Code, "name": .MAP_LABEL}]' world.topo.json > country_list.json && mv country_list.json ../../backend/data/country_list.json