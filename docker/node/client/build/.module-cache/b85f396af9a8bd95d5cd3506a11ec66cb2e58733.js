(function () {
    var converter = new Showdown.converter();

    var CommentBox = React.createClass({displayName: 'CommentBox',
        loadCommentsFromServer: function () {
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                success: function (data) {
                    this.setState({data:data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
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
                    React.createElement(CommentList, {data: this.state.data}), 
                    React.createElement(CommentForm, null)
                )
            );
        }
    });

    var CommentList = React.createClass({displayName: 'CommentList',
        render: function () {
            var commentNodes = this.props.data.map(function (comment, index) {
                return (
                    React.createElement(Comment, {author: comment.author}, 
                        comment.text
                    )
                );
            });

            return (
                React.createElement("div", {className: "commentList"}, 
                    commentNodes
                )
            );
        }
    });

    var CommentForm = React.createClass({displayName: 'CommentForm',
        render: function () {
            return (
                React.createElement("div", {className: "commentForm"}, 
                    "I am a comment form."
                )
            );
        }
    });

    var Comment = React.createClass({displayName: 'Comment',
        render: function () {
            var rawMarkup = converter.makeHtml(this.props.children.toString());

            return (
                React.createElement("div", {className: "comment"}, 
                    React.createElement("h2", {className: "commentAuthor"}, 
                        this.props.author
                    ), 
                    React.createElement("span", {dangerouslySetInnerHtml: {__html: rawMarkup}})
                )
            );
        }
    });

    React.render(
        React.createElement(CommentBox, {url: "/example.json", pollInterval: 2000}),
        document.getElementById('content')
    );
})();
