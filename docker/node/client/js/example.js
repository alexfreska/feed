(function () {
    var converter = new Showdown.converter();

    var Comment = React.createClass({
        render: function () {
            var rawMarkup = converter.makeHtml(this.props.children.toString());

            return (
                <div className="comment">
                    <h2 className="commentAuthor">
                        {this.props.author}
                    </h2>
                    <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
                </div>
            );
        }
    });

    var CommentList = React.createClass({
        render: function () {
            var commentNodes = this.props.data.map(function (comment, index) {
                console.log(comment.text);
                return (
                    <Comment author={comment.author} key={index}>
                        {comment.text}
                    </Comment>
                );
            });

            return (
                <div className="commentList">
                    {commentNodes}
                </div>
            );
        }
    });

    var CommentForm = React.createClass({
        handleSubmit: function (e) {
            e.preventDefault();
            var author = this.refs.author.getDOMNode().value.trim();
            var text = this.refs.text.getDOMNode().value.trim();

            if (!text || !author) {
                return;
            }

            this.props.onCommentSubmit({author: author, text: text});
            this.refs.author.getDOMNode().value = '';
            this.refs.text.getDOMNode().value = '';
        },
        render: function () {
            return (
                <form className="commentForm" onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Your name" ref="author" />
                    <input type="text" placeholder="Say something" ref="text" />
                    <input type="submit" value="Post" />
                </form>
            );
        }
    });

    var CommentBox = React.createClass({
        loadCommentsFromServer: function () {
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                success: function (data) {
                    this.setState({data:data});
                }.bind(this),
                error: function(xhr, status, error) {
                    console.error(this.props.url, status, error.toString());
                }.bind(this)
            });
        },
        handleCommentSubmit: function (comment) {
            var comments = this.state.data,
                newComments = comments.concat([comment]);
            this.setState({data: newComments}, function () {
                $.ajax({
                    url: this.props.url,
                    dataType: 'json',
                    type: 'POST',
                    data: comment,
                    success: function (data) {
                        this.setState({data: data});
                    }.bind(this),
                    error: function(xhr, status, error) {
                        console.error(this.props.url, status, error.toString());
                    }.bind(this)
                });
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
                <div className="commentBox">
                    <h1>Comments</h1>
                    <CommentList data={this.state.data}/>
                    <CommentForm onCommentSubmit={this.handleCommentSubmit} />
                </div>
            );
        }
    });

    React.render(
        <CommentBox url="example.json" pollInterval={2000} />,
        document.getElementById('content')
    );
})();
