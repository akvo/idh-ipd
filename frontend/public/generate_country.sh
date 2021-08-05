jq '[.objects?.Country_Polygon?.geometries?
    | .[]?.properties
    | {"id": .OBJECTID, "code": .M49Code, "name": .MAP_LABEL}]' world.topo.json > country_list.json
