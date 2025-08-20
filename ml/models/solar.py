from utils.gis import get_building_area

def estimate_solar(lat, lon):
    roof_area = get_building_area(lat, lon)
    if not roof_area:
        return {"error": "No building found at this location"}


    efficiency = 0.18  
    irradiance = 1500  
    potential_kwh = roof_area * efficiency * irradiance

    return {
        "lat": lat,
        "lon": lon,
        "roof_area_m2": roof_area,
        "estimated_generation_kWh_per_year": round(potential_kwh, 2)
    }
