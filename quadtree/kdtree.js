//TODO: move Point ans Rectange to some central location. rn exporting is not working for some reason

class Node {
    constructor(point, boundary = null) {
        this.boundary = boundary; //boundary is stored as a class property only for vizualization
        // for range queries, boundary can be generated on the fly during recursion
        this.point = point;
        this.left = null; //REMEMBER: ig left beocmes upper half if diving vertically!
        this.right = null;
    }

}

class KdTree {

    constructor() {
        this.root = null;
    }


    build_helper(points, depth, boundary) {
        var self = this;

        if (points.length === 1) {

            return new Node(points[0], boundary);
        }

        let isEven = depth % 2 === 0;

        if (isEven) {
            points.sort((a, b) => a.x - b.x);
            let median = Math.floor(points.length / 2);
            var P1 = points.slice(0, median);
            var P2 = points.slice(median);

            let xmedian = P1[P1.length - 1].x;
            var leftBoundary = new Rectangle(boundary.x, boundary.y, xmedian - boundary.x, boundary.h);
            var rightBoundary = new Rectangle(xmedian, boundary.y, boundary.x + boundary.w - xmedian, boundary.h);
        }
        else {
            points.sort((a, b) => a.y - b.y);
            let median = Math.floor(points.length / 2);
            var P1 = points.slice(0, median);
            var P2 = points.slice(median);

            let ymedian = P1[P1.length - 1].y;
            var rightBoundary = new Rectangle(boundary.x, ymedian, boundary.w, boundary.y + boundary.h - ymedian);
            var leftBoundary = new Rectangle(boundary.x, boundary.y, boundary.w, ymedian - boundary.y);
        }

        let node = new Node();
        console.log(P1, P2);
        node.boundary = boundary;
        node.left = self.build_helper(P1, depth + 1, leftBoundary);
        node.right = self.build_helper(P2, depth + 1, rightBoundary);
        return node;


    }

    build(points, boundary) {
        // Build a Kd tree from an array of points. O(n logn logn)
        // The function should take O(n logn) if the median finding can be done in O(n)
        // In this implementation, the median is found in O(n logn)
        // To get median in O(n), you can use a complicated algorihtm, OR,
        // another way is to presort the input arrays on x and y coordinates:
        // http://www.cs.utah.edu/~lifeifei/cs6931/kdtree.pdf

        this.root = this.build_helper(points, 0, boundary)
    }

    getAllPoints(node, points) {
        var self = this;

        if (node.point) {
            points.push(node.point);
            count += 1;
            return
        }

        if (node.left !== null) {
            self.getAllPoints(node.left, points);
        }
        if (node.right !== null) {
            self.getAllPoints(node.right, points);
        }
    }

    query_helper(range, node, points, searchedNodes) {
        var self = this;

        if (node.point) {

            searchedNodes.push(node.boundary);
            count += 1;

            if (range.contains(node.point)) {
                points.push(node.point);
            }
            return [points, searchedNodes];
        }

        if (node.left.boundary.liesInside(range)) {
            searchedNodes.push(node.left.boundary);
            this.getAllPoints(node.left, points);
        }

        else if (range.intersects(node.left.boundary)) {
            self.query_helper(range, node.left, points, searchedNodes);
        }

        if (node.right.boundary.liesInside(range)) {
            searchedNodes.push(node.right.boundary);
            this.getAllPoints(node.right, points);
        }
        else if (range.intersects(node.right.boundary)) {
            self.query_helper(range, node.right, points, searchedNodes);
        }

        return [points, searchedNodes];

    }

    query(range, node = this.root) {
        // makes an orthogonal query for all the points lying in range

        return this.query_helper(range, node, [], []);
    }

    //show function : for debugging
    show(node = this.root) {
        var self = this

        if (node === null) {
            return;
        }



        if (node.point) {
            stroke(100, 200, 100);
            strokeWeight(10);
            point(node.point.x, node.point.y);

            stroke(150, 150, 150);
            strokeWeight(1);
            noFill()
            rect(node.boundary.x, node.boundary.y, node.boundary.w, node.boundary.h);
        }

        if (node.left !== null) {
            self.show(node.left);
        }
        if (node.right !== null) {
            self.show(node.right);
        }
    }

}
