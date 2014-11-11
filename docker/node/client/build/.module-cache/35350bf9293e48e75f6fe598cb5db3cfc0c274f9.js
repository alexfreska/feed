(function () {
    var converter = new Showdown.converter();

    var Comment = React.createClass({displayName: 'Comment',
        render: function () {
            var rawMarkup = converter.makeHtml(this.props.children.toString());

            return (
                React.createElement("div", {className: "comment"}, 
                    React.createElement("h2", {className: "commentAuthor"}, 
                        this.props.author
                    ), 
                    React.createElement("span", {dangerouslySetInnerHTML: {__html: rawMarkup}})
                )
            );
        }
    });

    var CommentList = React.createClass({displayName: 'CommentList',
        render: function () {
            var commentNodes = this.props.data.map(function (comment, index) {
                console.log(comment.text);
                return (
                    React.createElement(Comment, {author: comment.author, key: index}, 
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
        handleSubmit: function () {
            e.preventDefault();
            var author = this.refs.author.getDOMNode().value.trim();
            var text = this.refs.text.getDOMNode().value.trim();

            if (!text || !author) {
                return;
            }

            this.refs.author.getDOMNode().value = '';
            this.refs.text.getDOMNode().value = '';
        },
        render: function () {
            return (
                React.createElement("form", {className: "commentForm"}, 
                    React.createElement("input", {type: "text", placeholder: "Your name", ref: "author"}), 
                    React.createElement("input", {type: "text", placeholder: "Say something", ref: "text"}), 
                    React.createElement("input", {type: "submit", value: "Post"})
                )
            );
        }
    });

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
        handleCommentSubmit: function (commment) {

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

    React.render(
        React.createElement(CommentBox, {url: "example.json", pollInterval: 2000}),
        document.getElementById('content')
    );
})();
