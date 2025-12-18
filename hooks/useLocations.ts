import { locationService } from "@/services/locationService";
import { useQuery } from "@tanstack/react-query";

// Hook for fetching all countries
export const useCountries = () => {
    return useQuery({
        queryKey: ["countries"],
        queryFn: () => locationService.getCountries(),
        staleTime: 60 * 60 * 1000, // 1 hour
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
    });
};

// Hook for fetching states by country
export const useStatesByCountry = (countryId: string) => {
    return useQuery({
        queryKey: ["states", countryId],
        queryFn: () => locationService.getStatesByCountry(countryId),
        enabled: !!countryId,
        staleTime: 30 * 60 * 1000, // 30 minutes
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
    });
};

// Hook for fetching cities by state
export const useCitiesByState = (stateId: string) => {
    return useQuery({
        queryKey: ["cities", stateId],
        queryFn: () => locationService.getCitiesByState(stateId),
        enabled: !!stateId,
        staleTime: 30 * 60 * 1000, // 30 minutes
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
    });
};

// Hook for fetching city details by ID
export const useCityById = (cityId: string) => {
    return useQuery({
        queryKey: ["city", cityId],
        queryFn: () => locationService.getCityById(cityId),
        enabled: !!cityId,
        staleTime: 60 * 60 * 1000, // 1 hour
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
    });
}

// Hook for fetching state details by ID
export const useStateById = (stateId: string) => {
    return useQuery({
        queryKey: ["state", stateId],
        queryFn: () => locationService.getStateById(stateId),
        enabled: !!stateId,
        staleTime: 60 * 60 * 1000, // 1 hour
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
    });
};