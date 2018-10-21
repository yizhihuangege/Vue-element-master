/**
 * @file 统一处理 行政区域获取的API
 */
import { instance as $http } from '@/plugin/http';
import bus from '@/plugin/box_bus';



let areaData = {
    path: [],
    all_map: [],
    structuring_all_map: []
};


const areaAPI = {
    getArea(adcode = '') {
        const params = {
            adcode
        }
        return $http.get(`${process.env.GUESSING_HOST_URL}/api/agent/get_area`, { params })
    },
    getRegion(level = 1) {
        const params = {
            level
        }
        return $http.get(`${process.env.GUESSING_HOST_URL}/api/agent/get_region`, { params })
    },
    getAllMap() {
        return $http.get(`${process.env.GUESSING_HOST_URL}/api/agent/get_all_map`).then(resp => {
            if (resp.data.success) {
                const data = resp.data.data;
                areaData.all_map = data || [];
                this.formatAllMap();
            } else {
                console.error(`所有地图获取失败`)
            }
        })
    },
    formatAllMap() {
        let nationwide = areaData.all_map.find(area => area.id === 0);

        for (const area of areaData.all_map) {
            if (area.children.length > 0 && area.id !== 0) {
                nationwide.children.push(...area.children);
                delete area.children;
            }
        }
    },
    getFullPath(id = 0) {
        const params = {
            id
        }
        return $http.get(`${process.env.GUESSING_HOST_URL}/api/agent/get_map_by_id`, { params }).then(resp => {
            if (resp.data.success) {
                let data = resp.data.data || [];
                if (data.rows.length == 1 && data.rows[0].level == 1) {
                    return [data.rows[0].id]
                } else {
                    return data.rows.map(row => {
                        if (row.level == 1) {
                            return 0
                        } else {
                            return row.id
                        }
                    }).reverse();
                }
            } else {
                return 'error'
                // this.$message.error(resp.data.errors);
            }
            this.isLoad = false;
        }).catch(resp => {
            return 'error';
        })
    }

}


window.areaData = areaData;

export { areaData, areaAPI };