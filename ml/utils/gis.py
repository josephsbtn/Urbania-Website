import requests
import shapely.geometry
import shapely.ops
import pyproj

def get_building_area(lat, lon, radius=30):
    overpass_url = "http://overpass-api.de/api/interpreter"
    query = f"""
    [out:json];
    way(around:{radius},{lat},{lon})[building];
    out geom;
    """
    response = requests.get(overpass_url, params={'data': query})
    data = response.json()

    if not data['elements']:
        return None

    coords = [(p['lon'], p['lat']) for p in data['elements'][0]['geometry']]
    polygon = shapely.geometry.Polygon(coords)

    proj = pyproj.Transformer.from_crs("EPSG:4326", "EPSG:3857", always_xy=True)
    polygon_m = shapely.ops.transform(proj.transform, polygon)
    return round(polygon_m.area, 2)
