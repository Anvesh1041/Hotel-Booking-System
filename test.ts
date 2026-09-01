async function testConcurrency() {

    const url = "http://localhost:3000/api/booking";

    const booking = {
        user_id: 1,
        room_id: 2,
        check_in: "2026-11-10",
        check_out: "2026-11-15"
    };

    const requests = [
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(booking)
        }),

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...booking,
                check_in: "2026-11-15",
                check_out: "2026-11-18"
            })
        })
    ];

    const responses = await Promise.all(requests);

    for (const response of responses) {
        console.log("STATUS:", response.status);
        console.log("BODY:", await response.json());
    }
}

testConcurrency();