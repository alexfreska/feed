(function () {
    var converter = new Showdown.converter();

    var CommentBox = React.createClass({displayName: 'CommentBox',
        loadCommentsFromServer: function () {
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                success: function (data) {
                    this.setState(data);
                }.bind(this),
                error: function(xhr, status, error) {
                    console.error(this.props.url, status, error.toString());
                }.bind(this)
            });
        },

        getInitialState: function () {
            return {data: []};
        },
        componentDidMount: function () {
            this.loadCommentsFromServer();

            // Use sockets.io here instead of polling
            setInterval(this.loadCommentsFromServer, this.props.pollInterval);
        },
        render: function () {
            return (
                React.createElement("div", {className: "commentBox"}, 
                    React.createElement("h1", null, "Comments"), 
                    "// ", React.createElement(CommentList, {data: this.props.data}), 
                    "// ", React.createElement(CommentForm, null)
                )
            );
        }
    });

    // var CommentList = React.createClass({
    //     render: function () {
    //         var commentNodes = this.props.data.map(function (comment) {
    //             return (
    //                 <Comment author={comment.author} />
    //                     {comment.text}
    //                 </Comment>
    //             );
    //         });
    //
    //         return (
    //             <div className="commentList">
    //                 {commentNodes}
    //             </div>
    //         );
    //     }
    // });

    // var CommentForm = React.createClass({
    //     render: function () {
    //         return (
    //             <div className="commentForm">
    //                 I am a comment form.
    //             </div>
    //         );
    //     }
    // });
    //
    // var Comment = React.createClass({
    //     render: function () {
    //         var rawMarkup = converter.makeHtml(this.props.children.toString());
    //
    //         return (
    //             <div className="comment">
    //                 <h2 className="commentAuthor">
    //                     {this.props.author}
    //                 </h2>
    //                 <span dangerouslySetInnerHtml={{__html: rawMarkup}}
    //             </div>
    //         );
    //     }
    // });

    React.render(
        React.createElement(CommentBox, {url: _example.json, pollInterval: 2000}),
        document.getElementById('content')
    );
})();
