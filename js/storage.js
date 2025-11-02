// Database storage management for trips

// Save a trip to database
async function saveTrip(trip) {
    try {
        const response = await fetch('/api/trips.php?action=save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trip)
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error saving trip:', error);
        throw error;
    }
}

// Get all trips from database
async function getAllTrips() {
    try {
        const response = await fetch('/api/trips.php?action=all');
        const data = await response.json();
        
        if (data.success) {
            return data.trips;
        }
        return [];
    } catch (error) {
        console.error('Error fetching trips:', error);
        return [];
    }
}

// Get a specific trip from database
async function getTrip(tripId) {
    try {
        const response = await fetch(`/api/trips.php?action=get&trip_id=${tripId}`);
        const data = await response.json();
        
        if (data.success) {
            return data.trip;
        }
        return null;
    } catch (error) {
        console.error('Error fetching trip:', error);
        return null;
    }
}

// Delete a trip from database
async function deleteTripById(tripId) {
    try {
        const response = await fetch(`/api/trips.php?action=delete&trip_id=${tripId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting trip:', error);
        throw error;
    }
}

// Clear all trips from database
async function clearAllTripsData() {
    try {
        const response = await fetch('/api/trips.php?action=clear', {
            method: 'DELETE'
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error clearing trips:', error);
        throw error;
    }
}

// Export all trips as JSON
async function exportAllTrips() {
    const trips = await getAllTrips();
    const dataStr = JSON.stringify(trips, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_trips_backup.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Import trips from JSON (legacy support)
function importTrips(file) {
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            // Save each trip to database
            for (const trip of imported) {
                await saveTrip(trip);
            }
            
            showNotification(`Imported ${imported.length} trips!`, 'success');
            location.reload();
        } catch (error) {
            showNotification('Failed to import trips', 'error');
        }
    };
    reader.readAsText(file);
}
