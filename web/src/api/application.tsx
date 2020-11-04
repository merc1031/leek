import getFirebase from "../utils/firebase";
import env from "../utils/vars";

export interface Application {
    listApplications(): any;

    createApplication(application: { any }): any;

    purgeApplication(app_name: string): any;

    deleteApplication(app_name: string): any;

    addFanoutTrigger(app_name: string, trigger: { any }): any

    editFanoutTrigger(app_name: string, trigger_id: string, trigger: { any }): any

    deleteFanoutTrigger(app_name: string, trigger_id: string): any
}

export class ApplicationSearch implements Application {
    listApplications() {
        let fb = getFirebase();
        if (fb) {
            return fb.auth().currentUser.getIdToken().then(token =>
                fetch(`${env.LEEK_API_URL}/this/v1/applications`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                })
            );
        }
    }

    createApplication(application) {
        let fb = getFirebase();
        if (fb) {
            return fb.auth().currentUser.getIdToken().then(token =>
                fetch(`${env.LEEK_API_URL}/this/v1/applications`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(application)
                })
            );
        }
    }

    purgeApplication(app_name) {
        let fb = getFirebase();
        if (fb) {
            return fb.auth().currentUser.getIdToken().then(token =>
                fetch(`${env.LEEK_API_URL}/this/v1/applications/${app_name}/purge`,
                    {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    })
            );
        }
    }

    deleteApplication(app_name) {
        let fb = getFirebase();
        if (fb) {
            return fb.auth().currentUser.getIdToken().then(token =>
                fetch(`${env.LEEK_API_URL}/this/v1/applications/${app_name}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    })
            );
        }
    }

    addFanoutTrigger(app_name, trigger) {
        let fb = getFirebase();
        if (fb) {
            return fb.auth().currentUser.getIdToken().then(token =>
                fetch(`${env.LEEK_API_URL}/this/v1/applications/${app_name}/fo-triggers`,
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(trigger)
                    })
            );
        }
    }

    editFanoutTrigger(app_name, trigger_id, trigger) {
        let fb = getFirebase();
        if (fb) {
            return fb.auth().currentUser.getIdToken().then(token =>
                fetch(`${env.LEEK_API_URL}/this/v1/applications/${app_name}/fo-triggers/${trigger_id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(trigger)
                    })
            );
        }
    }

    deleteFanoutTrigger(app_name, trigger_id) {
        let fb = getFirebase();
        if (fb) {
            return fb.auth().currentUser.getIdToken().then(token =>
                fetch(`${env.LEEK_API_URL}/this/v1/applications/${app_name}/fo-triggers/${trigger_id}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    })
            );
        }
    }
}
