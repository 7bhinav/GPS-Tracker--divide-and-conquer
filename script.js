function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            const satellites = [
                { id: 1, latitude: 12.82335, longitude: 80.04253 },
                { id: 2, latitude: 12.82335, longitude: 80.04253 },
                { id: 3, latitude: 12.82335, longitude: 80.04253 }
            ];
            const distances = satellites.map((satellite) => calculateDistance(userPosition, satellite));

            // Calculate the user's position using the Divide-and-Conquer approach
            const { latitude, longitude } = calculatePositionRecursive(satellites, distances);
            const resultElement = document.getElementById('result');
            resultElement.textContent = `User's position: (${latitude}, ${longitude})`;
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function calculateDistance(userPosition, satellite) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = userPosition.latitude * Math.PI / 180;
    const φ2 = satellite.latitude * Math.PI / 180;
    const Δφ = (satellite.latitude - userPosition.latitude) * Math.PI / 180;
    const Δλ = (satellite.longitude - userPosition.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

function calculatePositionRecursive(satellites, distances) {
    // Base case: If only one satellite is left, return its position
    if (satellites.length === 1) {
        return satellites[0];
    }

    // Divide the problem into two halves
    const mid = Math.floor(satellites.length / 2);
    const leftSatellites = satellites.slice(0, mid);
    const rightSatellites = satellites.slice(mid);

    // Calculate the center of mass of each half
    const leftCenter = {
        latitude: leftSatellites.reduce((sum, s) => sum + s.latitude, 0) / leftSatellites.length,
        longitude: leftSatellites.reduce((sum, s) => sum + s.longitude, 0) / leftSatellites.length
    };
    const rightCenter = {
        latitude: rightSatellites.reduce((sum, s) => sum + s.latitude, 0) / rightSatellites.length,
        longitude: rightSatellites.reduce((sum, s) => sum + s.longitude, 0) / rightSatellites.length
    };

    // Calculate the distances from the user to the centers of mass
    const leftDistance = calculateDistance({ latitude: 0, longitude: 0 }, leftCenter);
    const rightDistance = calculateDistance({ latitude: 0, longitude: 0 }, rightCenter);

    // Choose the half with the closest center of mass and recurse
    if (leftDistance < rightDistance) {
        return calculatePositionRecursive(leftSatellites, distances);
    } else {
        return calculatePositionRecursive(rightSatellites, distances);
    }
}
