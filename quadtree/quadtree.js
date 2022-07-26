class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.divided = false;
    }

    contains(point) {
        return (point.x >= this.x &&
            point.x <= this.x + this.w &&
            point.y >= this.y &&
            point.y <= this.y + this.h);
    }

    intersects(range) {
        let intersects = !(this.x + this.w < range.x ||
            this.x > range.x + range.w ||
            this.y + this.h < range.y ||
            this.y > range.y + range.h);
        
        // if (!intersects) {
        //     stroke(255,0,0);
        //     strokeWeight(4);
        //     rect(this.x, this.y, this.w, this.h);
        // } else {
        //     stroke(0,255,0);
        //     strokeWeight(4);
        //     rect(this.x, this.y, this.w, this.h);
        // }

        return intersects;

    }

    liesInside(range) {
        // check if a given boundary lies inside a given range
        // both are rectangles
        return (this.x >= range.x &&
            this.x + this.w <= range.x + range.w &&
            this.y >= range.y &&
            this.y + this.h <= range.y + range.h);
    }

}

class Quadtree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false; //probably not needed
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let nw = new Rectangle(x, y, w / 2, h / 2);
        let ne = new Rectangle(x + w / 2, y, w / 2, h / 2);
        let sw = new Rectangle(x, y + h / 2, w / 2, h / 2);
        let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
        this.northwest = new Quadtree(nw, this.capacity);
        this.northeast = new Quadtree(ne, this.capacity);
        this.southwest = new Quadtree(sw, this.capacity);
        this.southeast = new Quadtree(se, this.capacity);
        this.divided = true;
    }

    insert(point) {

        if (!this.boundary.contains(point)) {
            return false;
        }
        
        if (!this.divided) {
            if (this.points.length < this.capacity) {
                this.points.push(point);
                return true;
            } else {
                //subdivide the quadtree, reallocate points to new quadrants
                this.subdivide();
                for (let p of this.points) {
                    (
                    this.northwest.insert(p) ||
                    this.northeast.insert(p) ||
                    this.southwest.insert(p) ||
                    this.southeast.insert(p)
                    );
                }
                //clear points from the current quadtree
                this.points = [];
            }
        }
        
        return (
            this.northwest.insert(point) ||
            this.northeast.insert(point) ||
            this.southwest.insert(point) ||
            this.southeast.insert(point)
        );
    }

    query(range, found = [], searched_quadrants = []) {

        // TODO: if boundary lies compleltely inside the range, 
        // return all points without checking (only traversing to leaf nodes required)


        if (!this.boundary.intersects(range)) {
            return [found, searched_quadrants];
        } else {
            // searched_quadrants.push(this.boundary);
        }

        if (this.divided) {
            this.northwest.query(range, found, searched_quadrants);
            this.northeast.query(range, found, searched_quadrants);
            this.southwest.query(range, found, searched_quadrants);
            this.southeast.query(range, found, searched_quadrants);
            return [found, searched_quadrants];
        }
        else {
            searched_quadrants.push(this.boundary);
            for (let p of this.points) {
                count ++;
                if (range.contains(p)) {
                    found.push(p);
                } 
            }
        }
        return [found, searched_quadrants];
    }

    // method to draw quadtree for p5.js
    // show() {
    //     stroke(255);
    //     strokeWeight(1);
    //     noFill();
    //     rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
    //     if (this.divided) {
    //         this.northwest.show();
    //         this.northeast.show();
    //         this.southwest.show();
    //         this.southeast.show();
    //     }
        
    // }
}