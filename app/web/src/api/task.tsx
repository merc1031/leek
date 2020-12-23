import {search} from "./search";
import moment from "moment";

export function getFilterQuery(app_env: string | undefined, filters: TaskFilters, ) {
    let time_filter;
    if (filters.interval_type === "at" && filters.timestamp_type && (filters.after_time || filters.before_time)) {
        time_filter = {range: {[filters.timestamp_type]: {}}};
        if (filters.after_time) time_filter.range[filters.timestamp_type]["gte"] = filters.after_time;
        if (filters.before_time) time_filter.range[filters.timestamp_type]["lte"] = filters.before_time;
    } else if (filters.interval_type === "past" && filters.timestamp_type && filters.past_time) {
        time_filter = {range: {[filters.timestamp_type]: {}}};
        time_filter.range[filters.timestamp_type]["gte"] = moment().valueOf() - filters.past_time;
    }
    let f = [
        {"match": {"kind": "task"}},
        app_env && {"match": {"app_env": app_env}},
        filters.name && {"match": {"name": filters.name}},
        filters.uuid && {"match": {"uuid": filters.uuid}},
        filters.state && {"match": {"state": filters.state}},
        filters.worker && {"match": {"worker": filters.worker}},
        filters.routing_key && {"match": {"routing_key": filters.routing_key}},
        filters.parent && {"match": {"parent": filters.parent}},
        filters.runtime && {"range": {"runtime": {[filters.runtime_op || "gte"]: filters.runtime}}},
        filters.retries && {"range": {"retries": {[filters.retries_op || "gte"]: filters.retries}}},
        filters.exception && {"match": {"exception": {"query": filters.exception}}},
        filters.traceback && {"match": {"traceback": {"query": filters.traceback}}},
        filters.args && {"match": {"args": {"query": filters.args}}},
        filters.kwargs && {"match": {"kwargs": {"query": filters.kwargs}}},
        filters.result && {"match": {"result": {"query": filters.result}}},
        time_filter
    ];
    return f.filter(Boolean);
}

export interface TaskFilters {
    name: string | null,
    uuid: string | null,
    state: string | null,
    worker: string | null,
    routing_key: string | null,
    parent: string | null,
    runtime: number | null,
    runtime_op: string | null,
    retries: number | null,
    retries_op: string | null,
    timestamp_type: number | null,
    interval_type: string | null,
    after_time: number | null,
    before_time: number | null,
    past_time: number | null,
    exception: string | null,
    traceback: string | null,
    args: string | null,
    kwargs: string | null,
    result: string | null,
}

export interface Task {
    filter(
        app_name: string,
        app_env: string | undefined,
        size: number,
        from_: number,
        order: string | "desc",
        filters: TaskFilters,
    ): any;

    getById(
        app_name: string,
        uuid: string,
    ): any;
}

export class TaskSearch implements Task {
    filter(
        app_name: string,
        app_env: string | undefined,
        size: number,
        from_: number,
        order: string | "desc",
        filters: TaskFilters,
    ) {
        return search(
            app_name,
            {
                query: {
                    "bool": {
                        "must": getFilterQuery(app_env, filters)
                    }
                },
                sort: [
                    {"timestamp": {"order": order}},
                ]
            },
            {
                size: size,
                from_: from_
            }
        )
    }

    getById(
        app_name: string,
        uuid: string,
    ) {
        return search(
            app_name,
            {
                query: {
                    "term": {
                        "_id": uuid
                    }
                }
            },
            {
                size: 1,
                from_: 0,
            }
        )
    }
}
